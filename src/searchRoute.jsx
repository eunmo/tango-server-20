import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Search from './search';

export default function () {
  const { keyword = '' } = useParams();
  const [initialValue, setInitialValue] = useState({});

  useEffect(() => {
    setInitialValue({ initialKeyword: keyword });
  }, [keyword]);

  return <Search initialValue={initialValue} />;
}
