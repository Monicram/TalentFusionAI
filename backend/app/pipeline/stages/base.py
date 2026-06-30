from abc import ABC, abstractmethod
from typing import Any

from app.pipeline.pipeline import PipelineContext


class PipelineStage(ABC):
    @abstractmethod
    def execute(self, context: PipelineContext) -> PipelineContext:
        pass
