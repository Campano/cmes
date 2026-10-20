import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import Header from '@theme-original/BlogPostItem/Header';

export default function HeaderWithImage(props) {
  const {image} = useBlogPost().assets;
  return (
    <>
      <Header {...props} />
      {image && <img className="margin-bottom--md" src={image} alt="" loading="lazy" />}
    </>
  );
}
