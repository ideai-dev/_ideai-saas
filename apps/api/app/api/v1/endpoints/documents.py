from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def create_document():
    return {"message": "Create document - implement document storage"}

@router.get("/{document_id}")
async def get_document(document_id: str):
    return {"message": f"Get document {document_id}"}
