Request Headers: 

ApiKey: {secret-api-key}
ProjectID: {project-id}

Request Body:

{
    "select": {
        // select object  (optional, if left optional it'll only fetch ID). 
    },
    "query": {
        // query object (optional, if left optional it'll select everything)
    },
    "sort": {
        // sort object (optional)
    }
}