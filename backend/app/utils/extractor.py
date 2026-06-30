import io
from fastapi import UploadFile

def extract_resume_text(file: UploadFile) -> str:
    filename = file.filename.lower()
    content = file.file.read()
    
    # Try parsing based on extension
    if filename.endswith(".pdf"):
        return _extract_pdf(content)
    elif filename.endswith(".docx"):
        return _extract_docx(content)
    else:
        # Fallback to plain text
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            # Maybe it's a binary file with wrong extension, but we can only try our best
            return ""

def _extract_pdf(content: bytes) -> str:
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            text = []
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
            return "\n".join(text)
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def _extract_docx(content: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(content))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""
