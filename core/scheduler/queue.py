import asyncio
from collections import deque
from typing import Any
from uuid import UUID


class InProcessJobQueue:
    def __init__(self):
        self._queue: deque[UUID] = deque()
        self._lock = asyncio.Lock()

    async def enqueue(self, job_id: UUID) -> None:
        async with self._lock:
            self._queue.append(job_id)

    async def dequeue(self) -> UUID | None:
        async with self._lock:
            if self._queue:
                return self._queue.popleft()
            return None

    async def size(self) -> int:
        async with self._lock:
            return len(self._queue)
