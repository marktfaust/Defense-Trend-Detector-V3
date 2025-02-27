import asyncio
from crawl4ai import * # type: ignore

# Modified crawl function to accept a URL parameter and return result.markdown.
async def crawl(url: str) -> str:
    async with AsyncWebCrawler() as crawler: # type: ignore
        result = await crawler.arun(url=url)
        print(result.markdown)
        return result.markdown

if __name__ == "__main__":
    asyncio.run(crawl())