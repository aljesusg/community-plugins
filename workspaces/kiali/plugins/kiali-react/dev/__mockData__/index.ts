import graphBookinfo from './graph/bookinfo.json';
import graphBookinfoIstioSystem from './graph/bookinfo,istio-system.json';
import graphEmpty from './graph/empty.json';
import config from './config.json';

export const kialiData: { [index: string]: any } = {
    graph: {
        'bookinfo': {
            graph: graphBookinfo
        },
        'bookinfo,istio-system': {
            graph: graphBookinfoIstioSystem
        },
        empty: graphEmpty
    },
    config: config
}
