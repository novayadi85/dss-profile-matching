import { useTranslation } from "react-i18next";

const Formation = ({ lineUps }) => {
    const { t } = useTranslation();
    console.log(lineUps)
    return (
        <div id="preview" className='mt-5'>
            <h2>{ t('Formation')} {'4-2-1-3'}</h2>
            {(Object.values(lineUps).length > 0) ? (
            <div id="preview-lineups">
                <div className="pitch-container">
                    <div className="pitch">
                        <div className="home">
                            <ul className="player" style={{ top: 'calc(50% - 16px)', left: '1.81818181818182%' }} title="" data-playerid={374613}>
                                <li className="player-name-wrapper">
                                        <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.GK && lineUps.GK.length > 0) ? lineUps.GK[0].name : "? GK"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.GK && lineUps.GK.length > 0) ? lineUps.GK[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(10% - 16px)', left: '10.9090909090909%' }} title="" data-playerid={143345}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.LB && lineUps.LB.length > 0) ? lineUps.LB[0].name : "? LB"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.LB && lineUps.LB.length > 0) ? lineUps.LB[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(35% - 16px)', left: '10.9090909090909%' }} title="" data-playerid={248278}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.CB && lineUps.CB.length > 0) ? lineUps.CB[0].name : "? CB 1"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.CB && lineUps.CB.length > 0) ? lineUps.CB[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(65% - 40px)', left: '10.9090909090909%' }} title="" data-playerid={42898}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.CB && lineUps.CB.length > 1) ? lineUps.CB[1].name : "? CB 2"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.CB && lineUps.CB.length > 1) ? lineUps.CB[1].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(90% - 16px)', left: '10.9090909090909%' }} title="" data-playerid={413674}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.RB && lineUps.RB.length > 0) ? lineUps.RB[0].name : "? RB"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.RB && lineUps.RB.length > 0) ? lineUps.RB[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(35% - 65px)', left: '22%' }} title="" data-playerid={433488}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.DM && lineUps.DM.length > 0) ? lineUps.DM[0].name : "? DM 1"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.DM && lineUps.DM.length > 0) ? lineUps.DM[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(65% - (-5px))', left: '22%' }} title="" data-playerid={126871}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.DM && lineUps.DM.length > 1) ? lineUps.DM[1].name : "? DM 2"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.DM && lineUps.DM.length > 1) ? lineUps.DM[1].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(20% - 10px)', left: '40.1818%' }} title="" data-playerid={141087}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.LWF && lineUps.LWF.length >= 1) ? lineUps.LWF[0].name : "? LWF"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.LWF && lineUps.LWF.length > 0) ? lineUps.LWF[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(50% - 16px)', left: '29.0909090909091%' }} title="" data-playerid={328504}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.CMD && lineUps.CMD.length >= 1) ? lineUps.CMD[0].name : "? CMF"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.CMD && lineUps.CMD.length > 0) ? lineUps.CMD[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(80% - 16px)', left: '40.1818%' }} title="" data-playerid={137533}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.RWF && lineUps.RWF.length >= 1) ? lineUps.RWF[0].name : "? RWF"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.RWF && lineUps.RWF.length > 0) ? lineUps.RWF[0].point : "N/A"}</li>
                            </ul>
                            <ul className="player" style={{ top: 'calc(50% - 16px)', left: '40.1818%' }} title="" data-playerid={311339}>
                                <li className="player-name-wrapper">
                                    <a className="player-name player-link cnt-oflow rc" href="#">{ (lineUps?.CF && lineUps.CF.length >= 1) ? lineUps.CF[0].name : "? CF"}</a>
                                </li>
                                <li className="player-rating rc">{ (lineUps?.CF && lineUps.CF.length > 0) ? lineUps.CF[0].point : "N/A"}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="clear" />
                </div>
                <div className="clear" />
            </div>
            ) : (null)}
            
        </div>
    )
}

export default Formation;