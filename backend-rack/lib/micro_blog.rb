require 'json'
require 'securerandom'
require 'pathname'
require 'faker'

require_relative 'micro_blog/db'
require_relative 'micro_blog/serializer'
require_relative 'micro_blog/api'
require_relative 'micro_blog/router'

module MicroBlog
  VERSION = '1.0.0'
  HEADERS = {
    'Content-Type' => 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin' => '*',
  }

  # Seed database with random posts
  def self.bootstrap!
    10.times do
      user = Faker::Twitter.user
      DB.save('posts', 'body' => Faker::Lorem.paragraph, 'slug' => user[:screen_name], 'name' => user[:name])
    end
  end
end
