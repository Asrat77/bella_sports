class AddTokenDigestToUserSessions < ActiveRecord::Migration[8.1]
  def change
    add_column :user_sessions, :token_digest, :string, null: false
    add_index :user_sessions, :token_digest, unique: true
    remove_column :user_sessions, :token, :string
  end
end
