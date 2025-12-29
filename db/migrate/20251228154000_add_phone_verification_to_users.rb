class AddPhoneVerificationToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :phone_verified_at, :timestamp
    add_column :users, :phone_verification_method, :string, default: "telegram_bot"
    add_column :users, :telegram_chat_id, :string

    # Add index for telegram_chat_id for efficient lookups
    add_index :users, :telegram_chat_id
  end
end
