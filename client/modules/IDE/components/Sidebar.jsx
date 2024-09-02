import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeProjectOptions,
  collapseSidebar,
  newFile,
  newFolder,
  openProjectOptions,
  openUploadFileModal
} from '../actions/ide';
import { selectRootFile } from '../selectors/files';
import { getAuthenticated, selectCanEditSketch } from '../selectors/users';

import ConnectedFileNode from './FileNode';
import { PlusIcon } from '../../../common/icons';
import { FileDrawer } from './Editor/MobileEditor';

export default function SideBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const rootFile = useSelector(selectRootFile);
  const ide = useSelector((state) => state.ide);
  const projectOptionsVisible = useSelector(
    (state) => state.ide.projectOptionsVisible
  );
  const isExpanded = useSelector((state) => state.ide.sidebarIsExpanded);
  const canEditProject = useSelector(selectCanEditSketch);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedFileId, setMatchedFileId] = useState(null);

  const sidebarOptionsRef = useRef(null);
  const isAuthenticated = useSelector(getAuthenticated);

  const findMatchingFile = (file, query) => {
    if (file.name && file.name.toLowerCase() === query.toLowerCase()) {
      return file;
    }
    if (file.children) {
      return file.children.find((child) => findMatchingFile(child, query));
    }
    return null;
  };

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
    const matchedFile = findMatchingFile(rootFile, e.target.value);
    setMatchedFileId(matchedFile ? matchedFile.id : null);
  };

  const sidebarClass = classNames({
    sidebar: true,
    'sidebar--contracted': !isExpanded,
    'sidebar--project-options': projectOptionsVisible,
    'sidebar--cant-edit': !canEditProject
  });

  return (
    <FileDrawer>
      {ide.sidebarIsExpanded && (
        <button
          data-backdrop="filedrawer"
          onClick={() => {
            dispatch(collapseSidebar());
            dispatch(closeProjectOptions());
          }}
        >
          {' '}
        </button>
      )}
      <section className={sidebarClass}>
        <header
          className="sidebar__header"
          onContextMenu={(e) => {
            e.preventDefault();
            if (projectOptionsVisible) {
              dispatch(closeProjectOptions());
            } else {
              sidebarOptionsRef.current?.focus();
              dispatch(openProjectOptions());
            }
          }}
        >
          <h3 className="sidebar__title">
            <span>{t('Sidebar.Title')}</span>
          </h3>
          <div className="sidebar__icons">
            <button
              aria-label={t('Sidebar.ToggleARIA')}
              className="sidebar__add"
              tabIndex="0"
              ref={sidebarOptionsRef}
              onClick={(e) => {
                e.preventDefault();
                if (projectOptionsVisible) {
                  dispatch(closeProjectOptions());
                } else {
                  sidebarOptionsRef.current?.focus();
                  dispatch(openProjectOptions());
                }
              }}
            >
              <PlusIcon focusable="false" aria-hidden="true" />
            </button>
          </div>
        </header>
        <div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchQuery}
          />
        </div>
        <ConnectedFileNode
          id={rootFile.id}
          searchQuery={searchQuery}
          matchedFileId={matchedFileId}
        />
      </section>
    </FileDrawer>
  );
}
