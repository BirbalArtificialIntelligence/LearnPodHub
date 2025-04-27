#!/usr/bin/env python3
"""
Birbal AI - Model Training Module

This module demonstrates the process of training and evaluating NLP models
using Hugging Face Transformers for multilingual content moderation.
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score

import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding
)
from datasets import Dataset
import mlflow
import mlflow.pytorch

# Set up environment variables
MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
HF_MODEL_NAME = os.getenv("HF_MODEL_NAME", "xlm-roberta-base")
EXPERIMENT_NAME = os.getenv("EXPERIMENT_NAME", "content-moderation")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET", "birbal-training-data")

# Configure MLflow
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
mlflow.set_experiment(EXPERIMENT_NAME)

# Define label mapping for moderation categories
LABEL_MAP = {
    "safe": 0,
    "hate_speech": 1,
    "violence": 2,
    "sexual_content": 3,
    "harassment": 4,
    "self_harm": 5,
}
ID_TO_LABEL = {v: k for k, v in LABEL_MAP.items()}


def load_dataset(file_path, text_col="text", label_col="label"):
    """
    Load dataset from a CSV file
    
    Args:
        file_path: Path to the CSV file
        text_col: Column name for text data
        label_col: Column name for labels
        
    Returns:
        Pandas DataFrame
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found: {file_path}")
    
    df = pd.read_csv(file_path)
    
    # Verify required columns
    if text_col not in df.columns:
        raise ValueError(f"Text column '{text_col}' not found in dataset")
    if label_col not in df.columns:
        raise ValueError(f"Label column '{label_col}' not found in dataset")
    
    # Convert string labels to numeric if needed
    if df[label_col].dtype == 'object':
        df[label_col] = df[label_col].map(LABEL_MAP)
    
    return df


def prepare_datasets(df, text_col="text", label_col="label", test_size=0.2, val_size=0.1):
    """
    Split data into training, validation and test sets
    
    Args:
        df: Input DataFrame
        text_col: Column name for text data
        label_col: Column name for labels
        test_size: Proportion of data for test set
        val_size: Proportion of training data for validation
        
    Returns:
        HuggingFace datasets for train, validation, and test
    """
    # First split into train and test
    train_df, test_df = train_test_split(
        df, test_size=test_size, stratify=df[label_col], random_state=42
    )
    
    # Split train into train and validation
    train_df, val_df = train_test_split(
        train_df, test_size=val_size, stratify=train_df[label_col], random_state=42
    )
    
    print(f"Training set: {len(train_df)} samples")
    print(f"Validation set: {len(val_df)} samples")
    print(f"Test set: {len(test_df)} samples")
    
    # Convert to HuggingFace datasets
    train_dataset = Dataset.from_pandas(train_df)
    val_dataset = Dataset.from_pandas(val_df)
    test_dataset = Dataset.from_pandas(test_df)
    
    return train_dataset, val_dataset, test_dataset


def tokenize_datasets(datasets, tokenizer, text_col="text", max_length=512):
    """
    Tokenize datasets using the provided tokenizer
    
    Args:
        datasets: Tuple of (train, val, test) datasets
        tokenizer: HuggingFace tokenizer
        text_col: Column name for text data
        max_length: Maximum token length
        
    Returns:
        Tokenized datasets
    """
    train_dataset, val_dataset, test_dataset = datasets
    
    def tokenize_function(examples):
        return tokenizer(
            examples[text_col],
            padding="max_length",
            truncation=True,
            max_length=max_length
        )
    
    # Apply tokenization
    tokenized_train = train_dataset.map(tokenize_function, batched=True)
    tokenized_val = val_dataset.map(tokenize_function, batched=True)
    tokenized_test = test_dataset.map(tokenize_function, batched=True)
    
    # Set format for PyTorch
    tokenized_train.set_format("torch", columns=["input_ids", "attention_mask", "label"])
    tokenized_val.set_format("torch", columns=["input_ids", "attention_mask", "label"])
    tokenized_test.set_format("torch", columns=["input_ids", "attention_mask", "label"])
    
    return tokenized_train, tokenized_val, tokenized_test


def train_model(train_dataset, val_dataset, model_name=HF_MODEL_NAME, num_labels=len(LABEL_MAP)):
    """
    Train a Hugging Face transformer model
    
    Args:
        train_dataset: Training dataset
        val_dataset: Validation dataset
        model_name: Hugging Face model name
        num_labels: Number of classification labels
        
    Returns:
        Trained model and tokenizer
    """
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, num_labels=num_labels
    )
    
    # Data collator for dynamic padding
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
    
    # Define training arguments
    training_args = TrainingArguments(
        output_dir="./results",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=3,
        weight_decay=0.01,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True,
        push_to_hub=False,
    )
    
    # Define compute_metrics function
    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        
        accuracy = accuracy_score(labels, predictions)
        f1 = f1_score(labels, predictions, average='weighted')
        
        return {
            "accuracy": accuracy,
            "f1": f1
        }
    
    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )
    
    # Start MLflow run
    with mlflow.start_run(run_name=f"train-{model_name}"):
        # Log parameters
        mlflow.log_param("model_name", model_name)
        mlflow.log_param("num_train_samples", len(train_dataset))
        mlflow.log_param("num_val_samples", len(val_dataset))
        mlflow.log_param("learning_rate", training_args.learning_rate)
        mlflow.log_param("batch_size", training_args.per_device_train_batch_size)
        mlflow.log_param("epochs", training_args.num_train_epochs)
        
        # Train model
        print("Training model...")
        trainer.train()
        
        # Evaluate model
        print("Evaluating model...")
        eval_results = trainer.evaluate()
        
        # Log metrics
        for key, value in eval_results.items():
            mlflow.log_metric(key, value)
        
        # Log model
        mlflow.pytorch.log_model(
            model, 
            "model",
            registered_model_name=f"moderation-{model_name}"
        )
    
    return model, tokenizer


def evaluate_model(model, test_dataset, tokenizer):
    """
    Evaluate model on test dataset
    
    Args:
        model: Trained model
        test_dataset: Test dataset
        tokenizer: Tokenizer used for the model
        
    Returns:
        Evaluation metrics
    """
    # Use the Trainer for evaluation
    trainer = Trainer(
        model=model,
        tokenizer=tokenizer,
    )
    
    # Get predictions
    predictions = trainer.predict(test_dataset)
    preds = np.argmax(predictions.predictions, axis=-1)
    labels = predictions.label_ids
    
    # Calculate metrics
    report = classification_report(
        labels, 
        preds, 
        target_names=[ID_TO_LABEL[i] for i in range(len(LABEL_MAP))],
        output_dict=True
    )
    
    # Log detailed evaluation with MLflow
    with mlflow.start_run(run_name="evaluation"):
        for category, metrics in report.items():
            if isinstance(metrics, dict):
                for metric_name, value in metrics.items():
                    mlflow.log_metric(f"{category}_{metric_name}", value)
        
        # Log confusion matrix as a figure
        try:
            from sklearn.metrics import confusion_matrix
            import matplotlib.pyplot as plt
            import seaborn as sns
            
            cm = confusion_matrix(labels, preds)
            plt.figure(figsize=(10, 8))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                        xticklabels=[ID_TO_LABEL[i] for i in range(len(LABEL_MAP))],
                        yticklabels=[ID_TO_LABEL[i] for i in range(len(LABEL_MAP))])
            plt.title('Confusion Matrix')
            plt.ylabel('True Label')
            plt.xlabel('Predicted Label')
            plt.tight_layout()
            
            # Save and log figure
            plt.savefig("confusion_matrix.png")
            mlflow.log_artifact("confusion_matrix.png")
        except Exception as e:
            print(f"Could not create confusion matrix visualization: {e}")
    
    return report


def main():
    """Main function to demonstrate the model training workflow"""
    
    # Example dataset path (should be provided by environment variable in production)
    dataset_path = os.getenv("DATASET_PATH", "data/moderation_dataset.csv")
    
    try:
        # Load and prepare dataset
        print(f"Loading dataset from {dataset_path}")
        df = load_dataset(dataset_path)
        
        # Prepare datasets
        datasets = prepare_datasets(df)
        
        # Initialize tokenizer
        tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_NAME)
        
        # Tokenize datasets
        tokenized_datasets = tokenize_datasets(datasets, tokenizer)
        
        # Train model
        model, tokenizer = train_model(
            tokenized_datasets[0],  # train
            tokenized_datasets[1],  # validation
        )
        
        # Evaluate model
        eval_report = evaluate_model(model, tokenized_datasets[2], tokenizer)
        
        print("\nModel Training Complete!")
        print(f"Overall F1 Score: {eval_report['weighted avg']['f1-score']:.4f}")
        
    except Exception as e:
        print(f"Error in training pipeline: {e}")


if __name__ == "__main__":
    main()
