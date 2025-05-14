# Test fpr couchdb (server) + pouch (client)

## Backend
Start couchdb server before testing, e.g. like 

> sudo -u couchdb /opt/couch/3_4_3/bin/couchdb 

Stop later with 

> sudo -u couchdb /opt/couch/3_4_3/erts-14.2.5.8/bin/epmd -kill

or use service

Backend access: http://127.0.0.1:5984/_utils/


## Client

export and restore database to/from file.
save counter value to couchdb

**!Note:** without loading db from server a new docuemnt *counter5* will be created 
by the client. This throws conflict on subsequent sync. Make sure to have server ready before 
starting client. 

