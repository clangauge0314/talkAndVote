from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name',
            'date_of_birth',
            'gender',
            'is_verified',
        ]
        read_only_fields = ['email', 'is_verified']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'date_of_birth',
            'gender',
            'current_password',
            'new_password',
        ]

    def validate(self, data):
        if 'new_password' in data and not data.get('current_password'):
            raise serializers.ValidationError(
                {"current_password": "현재 비밀번호를 입력해주세요."}
            )
        return data

    def update(self, instance, validated_data):
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)

        if current_password and new_password:
            if not instance.check_password(current_password):
                raise serializers.ValidationError(
                    {"current_password": "현재 비밀번호가 일치하지 않습니다."}
                )
            instance.set_password(new_password)

        return super().update(instance, validated_data)
