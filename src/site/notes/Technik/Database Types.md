---
{"dg-publish":true,"dg-path":"Tech/Database Types.md","permalink":"/tech/database-types/","tags":["knowledge-base"],"created":"2024-08-09T07:54:46.863+02:00","updated":"2025-05-23T14:19:10.695+02:00"}
---

[7 Database Paradigms (youtube.com)](https://www.youtube.com/watch?v=W2Z7fbCLSTw)
## 1. Key-Value
Example: Redis, Memcached
- Entries are just pairs of keys and values
- Database is usually stored in memory
- Very fast, but limited space (amount of RAM)
- No advanced queries (e.g. join, filter), just set and get
Good for: Caching, Pub/Sub, Highscores, unstructured data
Not: Main/persistent app data, complex relations
## 2. Wide-column
Example: Cassandra, Hbase
- Fixed columns for values
- Key -> row of values
- No schema (data types for columns is not fixed)
- Query language is like SQL, but simpler (no join)
- Scales well horizontally
Good for: Time-series, historical records, high-write to low-read ratio
Not: Primary app database
## 3. Document
Example: MongoDB, Firestore
- Data is collection of documents
- Collections and documents can have hierarchy
- Documents are key-value stores (unstructured, without schema)
- Very flexible in data modeling
- Quite complex on the inside
- SQL: group data by content-type (posts, comments, authors, etc.) <-> Mongo: group data by application
- Reads can be faster (get all data for blog post from one source), but writes can be complex (update author name needs to touch all documents by that author)
- No join, but data can be grouped into "master" document by references
Good for: it is very general purpose, unstructured data
Not: it is too general purpose, also graphs (needs join)
## 4. Relational
Example: MySQL, Postgres
- Data is grouped by content-type (e.g. 3 tables for users, comments, posts)
- Each entry has its own unique key
- Entries can reference elements from other tables by these keys
- Join fetches the data from the referenced "foreign" tables into one
- Schema is required (column names and data-types are fixed)
- ACID complicant: atomicity, consistency, isolation, durability
- Difficult to scale
Good for: most data
Not: unstructured data
## 5. Graph
Example: Neo4j, Dgraph
- Data is nodes, relationships are edges in a graph
- Custom query language
- No join required, queries can be more concise
Good for: graphs, recommendation engines
Not: not-graphs?
## 6. Search / Index
Example: Elasticsearch, Lucene, Solr, Meiliserach
- Similar to Document-type
- DB analyzes text in documents and creates index of searchable terms
- Can add algorithms for ranking, spell-checking, filtering, etc.
- Very fast for its main purpose (search only hits index, not all documents)
- Adds overhead, can be expensive at scale
Good for: Search
## 7. Multi-model
Example: FaunaDB
- Frontend describes how it wants to access data in GraphQL schema
- Fauna creates collections and index from schema
- Uses multiple DB models in background