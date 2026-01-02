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
    user = User.find_or_create_by!(telegram_id: telegram_id) do |u|
      u.first_name = first_name
      u.last_name = last_name
      u.username = username
      u.photo_url = photo_url
      u.active = true
    end

    # Send verification request message via Telegram bot immediately after user creation
    # Also send reminder if existing user has unverified phone
    if user.phone_number.blank?
      send_verification_request_message(user)
    elsif !user.phone_verified_at?
      send_existing_user_reminder(user)
    end

    user
  end

  def self.send_verification_request_message(user)
    bot = TelegramBotService.bot

    message_text = <<~TEXT
      🔔 Welcome to Bella Sports!

      To complete your account setup and enable all features, please verify your phone number.

      This is required for:
      • Order confirmations and delivery updates
      • Customer support communication
      • Full account access

      Click the button below to share your contact information securely.
    TEXT

    keyboard = [
      [
        Telegram::Bot::Types::KeyboardButton.new(
          text: "📱 Verify Phone Number",
          request_contact: true
        )
      ]
    ]

    reply_markup = Telegram::Bot::Types::ReplyKeyboardMarkup.new(
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    )

    bot.api.send_message(
      chat_id: user.telegram_id,
      text: message_text,
      reply_markup: reply_markup
    )
  rescue => e
    Rails.logger.error "Error sending verification request: #{e.message}"
  end

  def self.send_existing_user_reminder(user)
    bot = TelegramBotService.bot

    message_text = <<~TEXT
      ⚠️ Phone Verification Reminder

      Hello! We noticed you haven't verified your phone number yet.

      Please verify your phone to enable:
      • Order confirmations and delivery updates
      • Customer support communication
      • Full account access

      Click the button below to share your contact securely.
    TEXT

    keyboard = [
      [
        Telegram::Bot::Types::KeyboardButton.new(
          text: "📱 Verify Phone Number",
          request_contact: true
        )
      ]
    ]

    reply_markup = Telegram::Bot::Types::ReplyKeyboardMarkup.new(
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    )

    bot.api.send_message(
      chat_id: user.telegram_id,
      text: message_text,
      reply_markup: reply_markup
    )
  rescue => e
    Rails.logger.error "Error sending verification reminder: #{e.message}"
  end

  def self.telegram_bot_token
    ENV["TELEGRAM_BOT_TOKEN"] || Rails.application.credentials.telegram_bot_token
  end
end
