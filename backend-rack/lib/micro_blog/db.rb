module MicroBlog
  class DB
    class Error < StandardError; end
    class InvalidTable < Error; end
    class RecordNotFound < Error; end

    TABLES = {
      'posts' => %w[id body slug name],
    }.freeze

    # In memory database
    @@data = TABLES.keys.each_with_object({}) {|table, m| m[table] = {} }

    def self.save(table, attrs)
      raise(InvalidTable) unless TABLES.key?(table)

      attrs['id'] ||= SecureRandom.uuid
      @@data[table][attrs['id']] = attrs.slice(*TABLES[table]) # slice only allowed attributes
      @@data[table][attrs['id']]
    end

    def self.find(table, id)
      raise(InvalidTable) unless TABLES.key?(table)
      raise(RecordNotFound) unless @@data[table].key?(id)

      @@data[table][id]
    end

    def self.delete(table, id)
      raise(InvalidTable) unless TABLES.key?(table)
      raise(RecordNotFound) unless @@data[table].key?(id)

      row = @@data[table][id]
      @@data[table].delete(id)
      row
    end

    def self.all(table)
      raise(InvalidTable) unless TABLES.key?(table)

      @@data[table].values
    end
  end
end
