import '@assets/css/preview.css';
import { positions } from '@helpers/position';
import { useEffect } from 'react';
import * as Tactic from './tactics';

const Preview = ({ players, formations }) => {
    let _lineUps = {};
    positions.forEach(pos => {
        const items = players.filter(player => player.position === pos.value)
        _lineUps = { ..._lineUps, [pos.value]: items }
    })

    let lineUps = _lineUps;
    /*
    let stocks = players;
    let optionals = {
        LB: ['RB', 'CB', 'DM'],
        CB: ['RB', 'LB', 'DM'],
        CB: ['RB', 'LB', 'DM'],
        RB: ['LB','CB', 'DM'],
        CMF: ['DM', 'CB', 'CMD'],
        AMF: ['CMD', 'CF', 'RWF', 'LWF'],
        CF: ['AMF','CMD', 'RWF', 'LWF'],
    }

    let quantities = {
        LB: 1,
        CB: 2,
        RB: 1,
        CMF: 2,
        AMF: 1,
        CF: 1,
        GK: 1
    }

    for (const pos in lineUps) {
        if (lineUps[pos].length < quantities[pos]) {
            if (stocks.length > 0){
                stocks.forEach((stock, index) => {
                    if (lineUps[stock.position].length > quantities[stock.position]   && optionals[pos].includes(stock.position)) {
                        lineUps[pos].push(stock);
                        stocks.splice(index, 1)
                    }
                })
            }
        }
    }
    */
    
    const DisplayFormation = ({ lineUps, formations }) => {
        let Element;
        if (formations === '442') {
            Element = <Tactic.FourFourTwo lineUps={lineUps} />;
        } 
        else if (formations === '4213') {
            Element = <Tactic.FourThreeThree lineUps={lineUps} />
        }
        else {
            Element = <Tactic.Standard lineUps={lineUps} />
        }
        
        return (
            <div>
              {Element}
            </div>
        );
        
    }

    useEffect(() => {
        
    }, [lineUps, formations])

    return (
        <div>
            <DisplayFormation lineUps={lineUps} formations={formations} />
        </div>
    );
}

export default Preview;