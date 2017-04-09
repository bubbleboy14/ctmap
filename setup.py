from setuptools import setup

setup(
    name='ctmap',
    version="0.1",
    author='Mario Balibrera',
    author_email='mario.balibrera@gmail.com',
    license='MIT License',
    description='Mapping plugin with real-time and persistent/analytical components',
    long_description='This package includes the necessary ingredients for building map-centric websites.',
    packages=[
        'ctmap'
    ],
    zip_safe = False,
    install_requires = [
        "ct >= 0.9.6.3"
    ],
    entry_points = '''''',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)
