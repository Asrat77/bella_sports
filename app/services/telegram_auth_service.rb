class TelegramAuthService
  class VerificationError < StandardError; end

  def self.verify_and_create_user!(auth_data)
    telegram_id = auth_data[:id]
    first_name = auth_data[:first_name]
    last_name = auth_data[:last_name]
    username = auth_data[:username]
    photo_url = auth_data[:photo_url]
    auth_date = auth_data[:auth_date]
    hash = auth_data[:hash]

    verify_hash!(auth_data, hash)
    verify_freshness!(auth_date)

    find_or_create_user!(telegram_id, first_name, last_name, username, photo_url)
  end

  def self.verify_hash!(auth_data, hash)
    data_check_string = build_data_check_string(auth_data)
    secret_key = Digest::SHA256.digest(telegram_bot_token)

    calculated_hash = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new("SHA256"), secret_key, data_check_string)

    unless ActiveSupport::SecurityUtils.secure_compare(calculated_hash, hash)
      raise VerificationError, "Invalid Telegram authentication data"
    end
  end

  def self.build_data_check_string(auth_data)
    data_to_check = auth_data.except(:hash)

    data_to_check
      .sort
      .map { |key, value| "#{key}=#{value}" }
      .join("\n")
  end

  def self.verify_freshness!(auth_date)
    auth_time = Time.at(auth_date.to_i)

    if (Time.current - auth_time) > 5.minutes
      raise VerificationError, "Authentication data is too old"
    end
  end

  def self.find_or_create_user!(telegram_id, first_name, last_name, username, photo_url)
    User.find_or_create_by!(telegram_id: telegram_id) do |user|
      user.first_name = first_name
      user.last_name = last_name
      user.username = username
      user.photo_url = photo_url
      user.active = true
    end
  end

  def self.telegram_bot_token
    ENV["TELEGRAM_BOT_TOKEN"] || Rails.application.credentials.telegram_bot_token
  end
end
