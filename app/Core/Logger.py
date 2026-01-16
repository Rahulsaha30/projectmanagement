import logging

def setup_logging():
    # Only setup if not already setup
    if logging.getLogger().hasHandlers():
        return logging.getLogger(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            # Console handler only
            logging.StreamHandler()
        ]
    )

    # Set console handler to DEBUG level to show all log levels
    console_handler = logging.getLogger().handlers[0]
    console_handler.setLevel(logging.DEBUG)

    # Create logger instance
    logger = logging.getLogger(__name__)

    return logger

# Example usage
if __name__ == "__main__":
    logger = setup_logging()
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")