import React, { useState, useEffect } from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import Prism from 'prismjs';

import LessonContentInput from './components/lesson-content-input';
import LessonContentPreview from './components/lesson-content-preview';
import axios from '../../src/js/axiosWithCsrf';

import { generateLink, encodeContent, decodeContent } from '../../src/js/previewShare';

const LessonPreview = () => {
  const [content, setContent] = useState('');
  const [convertedContent, setConvertedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(window.location.href);
  const [onPreviewTab, setOnPreviewTab] = useState(false);

  const fetchLessonPreview = async () => {
    if (onPreviewTab) return;

    const response = await axios.post('/lessons/preview', { content });

    if (response.status === 200) {
      setConvertedContent(response.data.content);
      setOnPreviewTab(true);
      Prism.highlightAll();
    }
  };

  const handleClick = () => {
    navigator.clipboard.writeText(link).then(() => setCopied(true));
  };

  useEffect(() => {
    const query = window.location.search;
    if (query) {
      const encodedContent = new URLSearchParams(query).get('content');
      setContent(decodeContent(encodedContent));
    }
  }, []);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 4000);
    }
  }, [copied]);

  useEffect(() => {
    const encodedContent = encodeContent(content);
    const generatedLink = generateLink(encodedContent);
    setLink(generatedLink);
  }, [content]);

  return (
    <Tabs selectedTabClassName="text-gray-900 bg-gray-100 hover:bg-gray-200 odin-dark-page-nav-item-active">
      <TabList className="flex items-center mb-3">
        <Tab onClick={() => setOnPreviewTab(false)} className="odin-dark-page-nav-item text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md border border-transparent px-3 py-1.5 font-medium cursor-pointer">Write</Tab>
        <Tab onClick={fetchLessonPreview} className="ml-2 odin-dark-page-nav-item text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md border border-transparent px-3 py-1.5 font-medium cursor-pointer">Preview</Tab>
      </TabList>

      <TabPanel>
        <LessonContentInput onChange={setContent} content={content} />
      </TabPanel>
      <TabPanel>
        <LessonContentPreview content={convertedContent} />
      </TabPanel>
      <button
        type="button"
        className={`button ${copied ? 'button--secondary' : 'button--primary'} float-right mb-1`}
        onClick={handleClick}
      >
        {copied ? 'Copied!' : 'Share'}
      </button>
    </Tabs>
  );
};

export default LessonPreview;
