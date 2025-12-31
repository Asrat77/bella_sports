class Api::V1::AuthController < Api::V1::BaseController
  skip_before_action :set_clazz
  before_action :authenticate_user!, only: [ :me ]
  rescue_from TelegramAuthService::VerificationError, with: :render_verification_error

  def telegram_callback
    auth_data = telegram_auth_params

    # Validate required fields are present
    required_fields = [ :id, :first_name, :auth_date, :hash ]
    missing_fields = required_fields.select { |field| auth_data[field].blank? }

    if missing_fields.any?
      render json: { error: "Missing required fields: #{missing_fields.join(", ")}" }, status: :unprocessable_entity
      return
    end

    user = TelegramAuthService.verify_and_create_user!(auth_data)
    result = user.generate_session!
    session = result[:session]
    token = result[:token]

    render(
      json: UserSessionSerializer.new(session).as_json.merge(token: token),
      status: :ok
    )
  end

  def me
    return render_unauthorized unless current_user

    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    render(json: { data: UserSerializer.new(current_user).as_json }, status: :ok)
  end

  private

  def telegram_auth_params
    params.permit(:id, :first_name, :last_name, :username, :photo_url, :auth_date, :hash).to_h.symbolize_keys
  end

  def render_verification_error(exception)
    render json: { error: exception.message }, status: :unprocessable_entity
  end
end
