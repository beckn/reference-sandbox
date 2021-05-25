import React from 'react';
import { Link } from 'react-router-dom';

function HomePage(props) {
    return (
        <div>
            <p className="m-2">You can <Link to="/newPlatform">add your own platforms here</Link> by following this link or clicking <b>Add new platform</b> in the navbar</p>
            <p className="m-2">You can <Link to="/platforms">see a list of all platforms added to the sandbox</Link> by following this link or clicking <b>Platforms</b> in the navbar. You can click any of the platforms in the list to see more details about the same and edit them.</p>
            <p className="m-2">You can <Link to="/networkSettings">see and edit settings common for the sandbox</Link> by following this link or clicking <b>Network settings</b> in the navbar. Currently you can view/set the BG URL that will be used by all the mock platforms</p>
        </div>
    );
}

export default HomePage;