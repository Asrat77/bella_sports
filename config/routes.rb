Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", :as => :rails_health_check

  # Public API
  namespace :api do
    namespace :v1 do
      get "profile/update"
      resources :products, only: [ :index, :show ] do
        collection do
          get :search
          get :categories
        end
      end

      resources :orders, only: [ :create, :show ] do
        member do
          get "track/:tracking_code", to: "orders#track", as: :track
        end
      end

      resources :branches, only: [ :index ]

      # User Authentication
      namespace :auth do
        post :telegram_callback
        get :me
      end

      # Telegram Bot Webhook
      resources :telegram_webhooks, only: [ :create ]
    end
  end

  # Admin Panel
  namespace :admin do
    # Admin magic link auth
    resources :admins do
      member do
        post :magic_link
        get "verify/:token", to: "admins#verify", as: :verify
      end
    end

    # Protected admin routes (will add authentication later)
    resources :products
    resources :orders do
      resource :status, only: [ :create ]
    end
    resources :branches
  end
end
