#!/usr/bin/env python3
"""
Birbal AI - Text Preprocessing Module

This module provides utilities for preprocessing text data before ML model training.
It includes functions for cleaning, tokenization, and feature extraction.
"""

import re
import unicodedata
import pandas as pd
import spacy
from typing import List, Dict, Union, Optional
import os

# Load SpaCy models for different languages
# Note: These models need to be installed separately
try:
    nlp_en = spacy.load("en_core_web_sm")
    nlp_hi = spacy.load("xx_ent_wiki_sm")  # Multilingual model as fallback for Hindi
except OSError:
    print("Warning: Some SpaCy models are not installed. Run:")
    print("python -m spacy download en_core_web_sm")
    print("python -m spacy download xx_ent_wiki_sm")


def clean_text(text: str) -> str:
    """
    Clean text by removing special characters, normalizing whitespace,
    and performing basic normalization.
    
    Args:
        text: Input text string
        
    Returns:
        Cleaned text string
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Normalize unicode characters
    text = unicodedata.normalize('NFKC', text)
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def tokenize_text(text: str, language: str = "en") -> List[str]:
    """
    Tokenize text using SpaCy models based on language.
    
    Args:
        text: Input text string
        language: Language code (en, hi, etc.)
        
    Returns:
        List of tokens
    """
    if not text:
        return []
    
    # Select appropriate NLP model based on language
    if language == "en":
        nlp = nlp_en
    else:
        # Use multilingual model for other languages
        nlp = nlp_hi
    
    # Process text and extract tokens, filtering out stopwords and punctuation
    doc = nlp(text)
    tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
    
    return tokens


def extract_features(text: str, language: str = "en") -> Dict[str, Union[str, List[str], Dict[str, float]]]:
    """
    Extract linguistic features from text.
    
    Args:
        text: Input text string
        language: Language code
        
    Returns:
        Dictionary of extracted features
    """
    if not text:
        return {
            "tokens": [],
            "entities": [],
            "sentiment": {"positive": 0.0, "negative": 0.0, "neutral": 1.0}
        }
    
    # Clean the text first
    cleaned_text = clean_text(text)
    
    # Select appropriate NLP model
    if language == "en":
        nlp = nlp_en
    else:
        nlp = nlp_hi
    
    # Process text with SpaCy
    doc = nlp(cleaned_text)
    
    # Extract tokens
    tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
    
    # Extract named entities
    entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
    
    # Basic sentiment analysis (simplified)
    # Note: In production, use a dedicated sentiment model
    sentiment = {
        "positive": 0.0,
        "negative": 0.0,
        "neutral": 1.0
    }
    
    return {
        "tokens": tokens,
        "entities": entities,
        "sentiment": sentiment
    }


def preprocess_dataset(data_path: str, 
                       text_column: str, 
                       language_column: Optional[str] = None,
                       default_language: str = "en") -> pd.DataFrame:
    """
    Preprocess an entire dataset for model training.
    
    Args:
        data_path: Path to CSV or JSON dataset
        text_column: Name of column containing text data
        language_column: Name of column containing language codes (optional)
        default_language: Default language if language_column is not provided
        
    Returns:
        Pandas DataFrame with preprocessed features
    """
    # Load dataset
    if data_path.endswith('.csv'):
        df = pd.read_csv(data_path)
    elif data_path.endswith('.json'):
        df = pd.read_json(data_path)
    else:
        raise ValueError("Unsupported file format. Use CSV or JSON.")
    
    # Validate required columns
    if text_column not in df.columns:
        raise ValueError(f"Text column '{text_column}' not found in dataset")
    
    # Apply preprocessing to each row
    results = []
    
    for _, row in df.iterrows():
        text = row[text_column]
        
        # Get language if available
        language = default_language
        if language_column and language_column in df.columns:
            language = row[language_column]
        
        # Clean and tokenize text
        cleaned_text = clean_text(text)
        tokens = tokenize_text(cleaned_text, language)
        
        # Create preprocessed row
        preprocessed_row = row.to_dict()
        preprocessed_row['cleaned_text'] = cleaned_text
        preprocessed_row['tokens'] = tokens
        preprocessed_row['token_count'] = len(tokens)
        
        results.append(preprocessed_row)
    
    return pd.DataFrame(results)


if __name__ == "__main__":
    # Example usage
    sample_text = "Hello world! This is an example text with some #hashtags and http://example.com links."
    print("Original text:", sample_text)
    print("Cleaned text:", clean_text(sample_text))
    print("Tokens:", tokenize_text(clean_text(sample_text)))
    
    # Example of extracting features
    features = extract_features(sample_text)
    print("Features:", features)
    
    # Example of dataset preprocessing (with dummy path)
    example_path = os.getenv("DATASET_PATH", "data/example.csv")
    try:
        df = preprocess_dataset(example_path, "text", "language")
        print(f"Processed {len(df)} rows")
    except Exception as e:
        print(f"Could not process example dataset: {e}")
