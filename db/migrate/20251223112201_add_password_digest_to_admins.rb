class AddPasswordDigestToAdmins < ActiveRecord::Migration[8.1]
  def change
    add_column :admins, :password_digest, :string
  end
end
