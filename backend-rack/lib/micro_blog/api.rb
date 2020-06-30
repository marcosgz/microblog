require_relative 'db'
require_relative 'serializer'

module MicroBlog
  module Api
    class Debug
      def self.root(request, params)
        require 'pry'
        binding.pry
        [200, {'Content-Type' => 'text/plain'}, StringIO.new('ok')]
      end
    end

    class Posts
      def self.create(attrs = {})
        puts format("posts#create params: %p", attrs)

        entry = DB.save('posts', attrs)
        [201, HEADERS, Serializer.(entry)]
      end

      def self.update(attrs = {})
        puts format("posts#update params: %p", attrs)

        entry = DB.find('posts', attrs['id'])
        entry.merge(attrs)
        DB.save('posts', entry)
        [204, HEADERS, Serializer.(nil)]
      rescue DB::RecordNotFound
        not_found
      end

      def self.show(attrs = {})
        puts format("posts#show params: %p", attrs)

        entry = DB.find('posts', attrs['id'])
        [200, HEADERS, Serializer.(entry)]
      rescue DB::RecordNotFound
        not_found
      end

      def self.remove(attrs = {})
        puts format("posts#remove params: %p", attrs)

        DB.delete('posts', attrs['id'])
        [204, HEADERS, Serializer.(nil)]
      rescue DB::RecordNotFound
        not_found
      end

      def self.index(attrs)
        puts format("posts#index params: %p", attrs)

        entities = DB.all('posts')
        [200, HEADERS, Serializer.(entities)]
      end

      def self.not_found
        [404, HEADERS, Serializer.(error: 'not found')]
      end
    end
  end
end
