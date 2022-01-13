import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Search from './Search';

export default function SearchRoute() {
  const { keyword = '' } = useParams();
  const [initialValue, setInitialValue] = useState({});

  useEffect(() => {
    setInitialValue({ initialKeyword: keyword });
  }, [keyword]);

  return <Search initialValue={initialValue} />;
}
