module Searchable
  extend ActiveSupport::Concern

  included do
    include PgSearch::Model

    pg_search_scope :search,
      against: [ :name, :category, :league ],
      using: {
        tsearch: { prefix: true }
      }
  end
end
