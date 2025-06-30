// src/components/Meta.jsx
const Meta = ({ title, description, keywords, author, ogTitle, ogDescription, ogImage }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
    </>
  );
};

Meta.defaultProps = {
  title: 'Trek Nepal - Adventure Trekking in the Himalayas',
  description: 'Discover the best trekking routes in Nepal with expert guides. Everest Base Camp, Annapurna Circuit, and more.',
  keywords: 'nepal trekking, everest base camp, annapurna circuit, himalaya adventure',
};

export default Meta;
