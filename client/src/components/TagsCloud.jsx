import { React, useEffect, useState } from 'react';
import { fetchPopularTags } from '../http/tagsAPI';
import { TagCloud } from 'react-tagcloud';

const TagsCloud = () => {
  const [tags, setTags] = useState([]);
  const [tagsCount, setTagsCount] = useState([]);

  useEffect(() => {
    fetchPopularTags().then((data) => {
      setTags(data.tags);
      setTagsCount(data.tagsCount);
    });
  }, []);

  const tagsArr = tagsCount.map((item) => {
    return {
      value: tags.filter((tag) => tag.id === item.tagId)[0].text,
      count: item.tagCount,
    };
  });

  return (
    <div className="tags-cloud">
      <h1>#Tags</h1>
      <TagCloud
        className="d-flex flex-wrap justify-content-center"
        minSize={12}
        maxSize={35}
        tags={tagsArr}
        onClick={(tag) => alert(`'${tag.value}' was selected!`)}
      />
    </div>
  );
};

export default TagsCloud;
