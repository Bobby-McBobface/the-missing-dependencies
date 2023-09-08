import React from 'react';

function Output({  output  }){
    return (
        <div className="w-[40rem] bg-gray-800 h-screen border-l-2 border-gray-700">
            <div className="text-3xl font-semibold py-6 text-center tracking-wider uppercase ">
                <pre>{output}</pre> // Change this to output. //
            </div>
        </div>
    );
};

export default Output;
