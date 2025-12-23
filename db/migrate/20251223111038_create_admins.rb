class CreateAdmins < ActiveRecord::Migration[8.1]
  def change
    create_table :admins, id: :uuid do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :name
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
