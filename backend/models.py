from pydantic import BaseModel
from typing import Optional


class AnalysisRequest(BaseModel):
    industry_name: str
    industry_size: str
    additional_context: Optional[str] = ""
