import React from 'react';
import Modal from './Modal';
import FilterSidebar from './FilterSidebar';

const FilterModal = ({ isOpen, onClose, filters, onChange, onReset, totalCount = null }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filters" maxWidth="560px">
      <FilterSidebar
        filters={filters}
        onChange={onChange}
        onReset={onReset}
      />
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
        <button
          onClick={onClose}
          className="btn btn-primary btn-block"
        >
          {totalCount !== null ? `Show ${totalCount} places` : 'Apply Filters'}
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
