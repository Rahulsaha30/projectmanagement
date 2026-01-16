import logging
import logging.handlers
from pathlib import Path

# Create logs directory if it doesn't exist
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        # Console handler
        logging.StreamHandler(),
        # File handler for all logs
        logging.FileHandler(logs_dir / "app.log"),
        # Rotating file handler for errors and warnings
        logging.handlers.RotatingFileHandler(
            logs_dir / "errors.log",
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
    ]
)

# Set specific levels for handlers
console_handler = logging.getLogger().handlers[0]
console_handler.setLevel(logging.INFO)

file_handler = logging.getLogger().handlers[1]
file_handler.setLevel(logging.DEBUG)

error_handler = logging.getLogger().handlers[2]
error_handler.setLevel(logging.WARNING)

# Create logger instance
logger = logging.getLogger(__name__)

# Example usage
if __name__ == "__main__":
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")