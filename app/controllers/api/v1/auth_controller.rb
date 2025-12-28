class Api::V1::AuthController < Api::V1::BaseController
  skip_before_action :set_clazz
  rescue_from TelegramAuthService::VerificationError, with: :render_verification_error

  def telegram_callback
    auth_data = telegram_auth_params.to_h.symbolize_keys

    user = TelegramAuthService.verify_and_create_user!(auth_data)
    session = user.generate_session!

    render_success(data: session, serializer_options: { user: user })
  end

  def me
    return render_unauthorized unless current_user

    render_success(data: current_user)
  end

  private

  def telegram_auth_params
    params.expect(telegram_auth: [ :id, :first_name, :last_name, :username, :photo_url, :auth_date, :hash ])[:telegram_auth] || {}
  end

  def render_verification_error(exception)
    render json: { error: exception.message }, status: :unprocessable_entity
  end
end
