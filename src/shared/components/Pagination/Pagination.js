import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import Button from '../Button/Button';
import './Pagination.scss';

const Pagination = ({
    className,
    current,
    total,
    onClick
}) => {
    const numbers = [];
    const max = Math.ceil(total / 5);
    const maxCount = max < 5 ? max : 5;

    if (current === 1) {
        for (let i = current; i < maxCount; i++) {
            numbers.push(i);
        }

        numbers.push(max);
    } else if (current === 2) {
        numbers.push(1);

        for (let i = current; i < maxCount; i++) {
            numbers.push(i);
        }

        numbers.push(max);
    } else if (current === max - 1) {
        numbers.push(1);
        
        for (let i = current - 2; i < maxCount + 2; i++) {
            numbers.push(i);
        }

        numbers.push(max);
    } else if (current === max) {
        numbers.push(1);

        for (let i = current - 3; i < maxCount + 2; i++) {
            numbers.push(i);
        }

        numbers.push(max);
    } else {
        numbers.push(1, current - 1, current, current + 1, max);
    }

    return (
        <div className={classNames('pagination', {
            [className]: className
        })}>
            {numbers.map(n => (
                <Button
                    key={n}
                    className={classNames('pagination__btn', {
                        'pagination__btn--active': n === current
                    })}
                    onClick={() => onClick(n)}
                >
                    {n}
                </Button>
            ))}
        </div>
    );
};

Pagination.propTypes = {
    className: PT.string,
    current: PT.number.isRequired,
    total: PT.number.isRequired,
    onClick: PT.func.isRequired
};

export default Pagination;
