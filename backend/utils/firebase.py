import firebase_admin
from firebase_admin import auth


def verify_firebase_id_token(id_token):
    """
    Firebase ID 토큰 검증
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None
