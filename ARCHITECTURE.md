
# Long Tail AMM architecture

Long Tail AMM's offchain component is primarily GraphQL, with a series of additional
services to aggregate and classify Superposition events. Events are stored in a Timescale
database with JSONB, and are available for developers to leverage hypertables to quickly
query derivative events optionally. This approach is built on aggressive pull instead of
push design, with more of an emphasis placed on aggressive managed caching by Hasura, as
opposed to well thought out backends.

Database functions and new types of tables are inserted using a versioned approach. Simple
functions for servicing queries should be used that are primarily stateless based on their
inputs, so developers can continue to release new features without considering the
backend.

The entire architecture should be ran as lambda instances.

