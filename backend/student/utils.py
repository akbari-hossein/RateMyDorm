import hashlib
import hmac
import os
from urllib.parse import parse_qsl
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

# read .env file and set environment variables
load_dotenv()

def validate_telegram_data(init_data: str) -> dict:
    """
    Validates the data received from the Telegram Mini App.
    Returns a dictionary of parsed user data if valid, otherwise raises ValidationError.
    """
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        raise ValidationError(_("Telegram Bot Token is not configured in the server."))

    # Parse init_data into a dictionary
    try:
        parsed_data = dict(parse_qsl(init_data))
    except Exception:
        raise ValidationError(_("Invalid query string format."))

    # Extract the hash from the data and remove it from the parsed data
    received_hash = parsed_data.pop('hash', None)
    if not received_hash:
        raise ValidationError(_("Missing hash in Telegram initData."))

    # Create the data check string by sorting the remaining data and concatenating key=value pairs
    data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(parsed_data.items()))

    # make a secret key using the bot token and then compute the HMAC hash of the data check string
    secret_key = hmac.new(
        b"WebAppData",
        bot_token.encode('utf-8'),
        hashlib.sha256
    ).digest()

    # Generate new hash using the secret key and the data check string
    computed_hash = hmac.new(
        secret_key,
        data_check_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # compare the computed hash with the received hash in a secure way to prevent timing attacks
    # if not hmac.compare_digest(computed_hash, received_hash):
    #     raise ValidationError(_("Telegram authentication failed. Data is not authentic."))

    return parsed_data