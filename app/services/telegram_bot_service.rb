class TelegramBotService
  class Error < StandardError; end

  def self.bot
    token = telegram_bot_token
    raise "Telegram bot token not configured. Please set TELEGRAM_BOT_TOKEN environment variable or add to Rails credentials." if token.blank?

    @bot ||= Telegram::Bot::Client.new(token)
  end

  def self.handle_webhook(update)
    message = update["message"]

    return unless message

    # Handle contact sharing
    if message["contact"]
      handle_contact_sharing(message)
    # Handle /start command
    elsif message["text"] == "/start"
      send_start_message(message["chat"]["id"])
    end
  end

  def self.handle_contact_sharing(message)
    contact = message["contact"]
    phone_number = contact["phone_number"]
    telegram_id = contact["user_id"]
    chat_id = message["chat"]["id"]

    # Find user by telegram_id
    user = User.find_by(telegram_id: telegram_id)

    if user
      # Update user with phone number and chat_id
      user.update!(
        phone_number: normalize_phone_number(phone_number),
        phone_verified_at: Time.current,
        telegram_chat_id: chat_id.to_s
      )

      # Send confirmation message
      send_confirmation_message(chat_id)

      # Optionally notify frontend that verification is complete
      # This could be implemented via WebSocket or polling
    else
      # Unknown user - send error message
      send_error_message(chat_id, "User not found. Please login through the website first.")
    end
  end

  def self.send_start_message(chat_id)
    welcome_text = <<~TEXT
      Welcome to Bella Sports!

      To verify your phone number, please click on the button below.
      This is required for:
      Order confirmations and delivery updates
      Customer support communication
      Full account access

      You can also send /start at any time to request verification again.
    TEXT

    keyboard = [
      [
        Telegram::Bot::Types::KeyboardButton.new(
          text: "Verify Phone Number",
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
      chat_id: chat_id,
      text: welcome_text,
      reply_markup: reply_markup
    )
  rescue Telegram::Bot::Exceptions::ResponseError => e
    Rails.logger.error "Telegram API error: #{e.message}"
  rescue => e
    Rails.logger.error "Error sending start message: #{e.message}"
  end

  def self.send_confirmation_message(chat_id)
    confirmation_text = <<~TEXT
      Phone number verified successfully!

      Your Bella Sports account is now fully activated. You can return to the website to continue shopping.

      We'll use this number for:
      Order confirmations
      Delivery updates
      Support communication

      Thank you!
    TEXT

    # Remove keyboard
    reply_markup = Telegram::Bot::Types::ReplyKeyboardRemove.new(remove_keyboard: true)

    bot.api.send_message(
      chat_id: chat_id,
      text: confirmation_text,
      reply_markup: reply_markup
    )
  rescue Telegram::Bot::Exceptions::ResponseError => e
    Rails.logger.error "Telegram API error: #{e.message}"
  rescue => e
    Rails.logger.error "Error sending confirmation message: #{e.message}"
  end

  def self.send_error_message(chat_id, error_text)
    bot.api.send_message(
      chat_id: chat_id,
      text: "Error: #{error_text}",
      reply_markup: Telegram::Bot::Types::ReplyKeyboardRemove.new(remove_keyboard: true)
    )
  rescue Telegram::Bot::Exceptions::ResponseError => e
    Rails.logger.error "Telegram API error: #{e.message}"
  rescue => e
    Rails.logger.error "Error sending error message: #{e.message}"
  end

  def self.telegram_bot_token
    ENV["TELEGRAM_BOT_TOKEN"] || Rails.application.credentials.telegram_bot_token
  end

  private

  def self.normalize_phone_number(phone)
    # Remove + and any non-digit characters
    phone.gsub(/[^\d]/, "")
  end
end
