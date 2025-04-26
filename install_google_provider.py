#!/usr/bin/env python
import os
import sys
import shutil
from pathlib import Path
import urllib.request
import tempfile
import zipfile

def install_google_provider():
    """
    Manually install the Google provider files from the latest django-allauth package
    """
    print("Installing Google provider for django-allauth...")
    
    # Create directory structure if it doesn't exist
    site_packages = Path([p for p in sys.path if "site-packages" in p][0])
    provider_dir = site_packages / "allauth" / "socialaccount" / "providers" / "google"
    
    if provider_dir.exists():
        print(f"Provider directory already exists at {provider_dir}")
        return
    
    # Create the directory structure
    os.makedirs(provider_dir, exist_ok=True)
    
    # Download the latest django-allauth
    print("Downloading latest django-allauth...")
    with tempfile.TemporaryDirectory() as tmpdirname:
        temp_dir = Path(tmpdirname)
        zip_path = temp_dir / "django-allauth.zip"
        
        # Download the zip file
        urllib.request.urlretrieve(
            "https://github.com/pennersr/django-allauth/archive/refs/heads/main.zip", 
            zip_path
        )
        
        # Extract the zip file
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # Find the extracted directory
        extracted_dir = next(temp_dir.glob("django-allauth-*"))
        
        # Copy the Google provider files
        source_provider_dir = extracted_dir / "allauth" / "socialaccount" / "providers" / "google"
        
        # Copy all files from the source provider directory
        for file_path in source_provider_dir.glob("*"):
            if file_path.is_file():
                shutil.copy2(file_path, provider_dir)
        
        # Create __init__.py if it doesn't exist
        init_py = provider_dir / "__init__.py"
        if not init_py.exists():
            with open(init_py, "w") as f:
                f.write("")
    
    print(f"Google provider installed successfully at {provider_dir}")

if __name__ == "__main__":
    install_google_provider() 