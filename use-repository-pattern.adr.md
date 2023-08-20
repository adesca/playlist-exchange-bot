Problem:
- the Database Backend Store file is becoming complex and difficult to test because it requires specially setup exchanges and players

Solution:
- Change to a repository pattern where the data retrieval details are handled by the repository, and converting the entities
into domain objects is handled by the DatabaseBackendStore service
- Hopefully this makes it easier to test when the retrieval logic is complicated vs when the conversion logic is complicated 
(like when we want to set entire player objects under "drawnPlayers" in order to access their player info )
- To this end:
  - The repositories return the database types
  - the backendStore returns domain entities
  - the player entity will be slightly denormalized in order to make it easier to query it without needing an exchange object
    - I think that using just ids referentially is useful when ORMing  because everything's already in the cache, or grabbing is automated,
    but in this case it adds extra repeated code that makes independent modules rely on each other
      - this could be wrong though lol
      - The denormalization: 
        - Add exchangeName column to the player table 