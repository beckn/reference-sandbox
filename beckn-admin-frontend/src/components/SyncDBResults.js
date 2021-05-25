import React from 'react';
import { ListOfPlatforms } from '.';

function SyncDBResults(props) {
    if(props.syncResults === {} || props.syncResults === undefined) {
        return(<div></div>);
    }
    let platforms = []
    for(let platform of props.syncResults) {
        const data = {...platform.value.platform, sync_status : platform.value.status, gateway_endpoint: platform.value.data?.bg_uri};
        delete data.public_key;
        delete data.city;
        delete data.country;
        delete data.is_mock;
        delete data.domain;
        delete data.active;
        delete data.createdAt;
        delete data.updatedAt;
        platforms.push(data);
    }
    return (
        <div>
            <ListOfPlatforms platforms={platforms}/>
        </div>
    );
}

export default SyncDBResults;