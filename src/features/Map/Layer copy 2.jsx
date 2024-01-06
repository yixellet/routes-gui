import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { useGetRentsByLanduserQuery } from '../Landusers/RentInfoByUser/RentInfoByUserAPI';

const { host, port } = require('../../config/mapserver.config');

export const Layer3 = ({ map }) => {

  const [skip, setSkip] = useState(true);
  const user = useSelector(state => state.rentInfoByUser.user);
  const { data } = useGetRentsByLanduserQuery(user, {skip});
  
  const [landsLayer, setL] = useState(new Vector({
    zIndex: 30,
    map: map,
    style: {
      'stroke-width': 0.8,
      'stroke-color': 'red',
      'fill-color': 'rgba(255,0,0,0.5)',
    },
  }));
  landsLayer.set('layer_name', 'by_user', true)
  useEffect(() => {
    let uu;
    setSkip(false)
    if (data) {
      if (user) {
        let string = ''
        data.forEach(d => {
          string += `'${d.json_build_object.properties.l.cadastral_number}', `
        });
        if (string.length > 0){
          landsLayer.setSource(new VectorSource({
            format: new GeoJSON(),
            url: `http://${host}:${port}/geoserver/invent/ows?` + 
                 `service=WFS&version=1.0.0&request=GetFeature&` +
                 `typeName=invent%3Alands_import&` +
                 `outputFormat=application%2Fjson&CQL_FILTER=cadastral_number IN (${string.slice(0, -2)})`
          }))
        }
      } else {
        landsLayer.setSource(null)
      }
    }
  }, [data, user, landsLayer])
  return null;
}