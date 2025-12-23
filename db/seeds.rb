# Bella Sports Database Seeds
# Run with: bin/rails db:seed

puts "🌱 Seeding Bella Sports database..."

# Create admin user for magic link authentication
admin = Admin.find_or_create_by!(email: "admin@bellasports.com") do |a|
  a.name = "Bella Sports Admin"
  a.password = "bellasports2024"  # In production, use environment variables
end

# Set password separately if it's a new record
if admin.new_record? || admin.password_digest.blank?
  admin.password = "bellasports2024"  # In production, use environment variables
  admin.save!
end
puts "✓ Created admin: #{admin.email}"

# Create pickup branches
branches_data = [
  { name: "Bole (Edna Mall Area)", address: "Edna Mall, Bole, Addis Ababa", phone: "+251911223344", sort_order: 1 },
  { name: "Piassa (Near Cinema Africa)", address: "Cinema Africa, Piassa, Addis Ababa", phone: "+251911334455", sort_order: 2 },
  { name: "Megenagna (Metebaber Building)", address: "Metebaber Building, Megenagna, Addis Ababa", phone: "+251911445566", sort_order: 3 }
]

branches = branches_data.map do |branch_data|
  Branch.find_or_create_by!(name: branch_data[:name]) do |branch|
    branch.address = branch_data[:address]
    branch.phone = branch_data[:phone]
    branch.active = true
    branch.sort_order = branch_data[:sort_order]
  end
end
puts "✓ Created #{branches.size} branches"

# Create sample products
products_data = [
  {
    name: "Ethiopian Coffee Home 24/25",
    price: 350000,  # 3500 ETB in cents
    category: "Ethiopian Premier League",
    league: "Ethiopian Premier",
    description: "Authentic Ethiopian Coffee FC home kit for the 2024/25 season.",
    customization_price: 50000  # 500 ETB
  },
  {
    name: "St. George FC Home 24/25",
    price: 350000,
    category: "Ethiopian Premier League",
    league: "Ethiopian Premier",
    description: "St. George FC home jersey for the Ethiopian Premier League.",
    customization_price: 50000
  },
  {
    name: "Manchester United Home 24/25",
    price: 450000,  # 4500 ETB
    category: "Premier League",
    league: "Premier League",
    description: "Official Manchester United home kit for the 2024/25 season.",
    customization_price: 50000
  },
  {
    name: "Arsenal Home 24/25",
    price: 450000,
    category: "Premier League",
    league: "Premier League",
    description: "Arsenal FC home jersey with the classic red and white design.",
    customization_price: 50000
  },
  {
    name: "Real Madrid Home 24/25",
    price: 480000,  # 4800 ETB
    category: "La Liga",
    league: "La Liga",
    description: "Real Madrid home kit featuring the famous white jersey.",
    customization_price: 50000
  },
  {
    name: "Barcelona Home 24/25",
    price: 480000,
    category: "La Liga",
    league: "La Liga",
    description: "FC Barcelona home kit with blaugrana colors.",
    customization_price: 50000
  },
  {
    name: "Ethiopian National Team Home",
    price: 320000,  # 3200 ETB
    category: "National Teams",
    league: "National",
    description: "Official Ethiopian National Team home jersey.",
    customization_price: 50000
  }
]

products = products_data.map do |product_data|
  Product.find_or_create_by!(name: product_data[:name]) do |product|
    product.price = product_data[:price]
    product.category = product_data[:category]
    product.league = product_data[:league]
    product.description = product_data[:description]
    product.customization_price = product_data[:customization_price]
    product.active = true
  end
end

# Add badges to some products
products.first.add_badge!("new")  # Ethiopian Coffee Home
products.second.add_badge!("best_seller")  # St. George FC
products.third.add_badge!("new")  # Manchester United
products[3].add_badge!("best_seller")  # Arsenal
products.last.add_badge!("best_seller")  # Ethiopian National Team

puts "✓ Created #{products.size} products with badges"

# Create inventory records for different sizes
sizes = [ "S", "M", "L", "XL", "XXL" ]
products.each do |product|
  sizes.each do |size|
    # Random stock levels
    quantity = [ 0, 5, 10, 15, 20, 25 ].sample
    product.update_stock!(size, quantity)
  end
end
puts "✓ Created inventory records for all products and sizes"

puts "🎉 Database seeded successfully!"
puts ""
puts "📊 Summary:"
puts "  • Admin: #{admin.email}"
puts "  • Branches: #{branches.size}"
puts "  • Products: #{products.size}"
puts "  • Total inventory records: #{InventoryRecord.count}"
puts ""
puts "🚀 Ready to test the API!"
