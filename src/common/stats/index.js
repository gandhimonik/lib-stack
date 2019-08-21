import React from 'react';
import { Image } from 'semantic-ui-react';

import eyeImg from '../../images/eye.svg';
import bugImg from '../../images/bug.svg';
import downloadImg from '../../images/download.svg';
import forkImg from '../../images/fork.svg';
import starImg from '../../images/star.svg';
import './index.css';

const Stats = ({type, watchers, stars, downloads, forks, bugs}) => {
    return (
        <div className={"lib-stats " + type}>
            <div className="statistic">
                <div className="label">
                    <Image src={starImg} />
                    <span>STARS</span>
                </div>
                <span className="value">{stars}</span>
            </div>
            <div className="statistic">
                <div className="label">
                    <Image src={eyeImg} />
                    <span>WATCHERS</span>
                </div>
                <span className="value">{watchers}</span>
            </div>
            <div className="statistic">
                <div className="label">
                    <Image src={downloadImg} />
                    <span>DOWNLOADS</span>
                </div>
                <span className="value">{downloads}</span>
            </div>
            <div className="statistic">
                <div className="label">
                    <Image src={bugImg} />
                    <span>BUGS</span>
                </div>
                <span className="value">{bugs}</span>
            </div>
            <div className="statistic">
                <div className="label">
                    <Image src={forkImg} />
                    <span>FORKS</span>
                </div>
                <span className="value">{forks}</span>
            </div>
        </div>
    )
};

export default Stats;