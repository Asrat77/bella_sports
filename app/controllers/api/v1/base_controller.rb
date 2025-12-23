class Api::V1::BaseController < ApplicationController
  include Common

  # No authentication for public API
end
