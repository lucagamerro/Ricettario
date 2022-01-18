import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

function Error() {
    let h = useHistory();

    useEffect(() => {
        h.push("/");
    }, [h]);

    return (
        <div className="container">
            <h1>404</h1>
        </div>
    )
}

export default Error;